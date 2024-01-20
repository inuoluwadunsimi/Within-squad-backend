import { Expo } from "expo-server-sdk";
import { config } from "../constants/settings";
import {
  BadRequestError,
  SendNotificationRequest,
  UserAuth,
  ExpoMessage,
  ServiceUnavailableError,
} from "../interfaces";
import { UserAuthDb, NotificationDb } from "../models/";

const expo = new Expo({ accessToken: config.notifications.expo_access_token });

const delayDuration = 20 * 60 * 1000;

export async function saveExpoTokens(
  userId: string,
  token: string
): Promise<void> {
  if (!Expo.isExpoPushToken(token)) {
    throw new BadRequestError("invalid push token");
  }

  await UserAuthDb.updateOne(
    { user: userId },
    {
      expoToken: token,
    }
  );
}

export async function sendBulkNotifications(payload: SendNotificationRequest) {
  const { title, body } = payload;

  const tokens: string[] = [];
  const userAuths = await UserAuthDb.find<UserAuth>({});
  for (const userAuth of userAuths) {
    tokens.push(...userAuth.expoToken);
  }

  for (const token of tokens) {
    const ticket = await expo.sendPushNotificationsAsync([
      {
        to: token,
        title,
        body,
        sound: "default",
      },
    ]);

    let ticketId = "";

    // I am declaring this as a variable separately because expo throws an error if
    // i call it directly

    if (ticket[0].status === "error") {
      if (
        ticket[0].details &&
        ticket[0].details.error === "DeviceNotRegistered"
      ) {
        await UserAuthDb.updateOne(
          { expoToken: ticket[0] },
          { $unset: { expoToken: 1 } }
        );
      }
      console.log(ticket[0].details);
      throw new ServiceUnavailableError("invalid expoToke | expo service down");
    }
    if (ticket[0].status === "ok") {
      ticketId = ticket[0].id;
    }

    const receipt = await expo.getPushNotificationReceiptsAsync([ticketId]);
    console.log(receipt);
    if (
      receipt[0].status === "error" &&
      receipt[0].details?.error === "DeviceNotRegistered"
    ) {
      await UserAuthDb.updateOne(
        { expoToken: token },
        { $unset: { expoToken: 1 } }
      );
    }

    const user = await UserAuthDb.findOne<UserAuth>({ expoToken: token });
    if (!user) {
      throw new BadRequestError("user expotoken mismatch");
    }

    await NotificationDb.create({
      token,
      title,
      body,
      user: user.user,
    });
  }
}

export async function getNotfications(userId: string): Promise<Notification[]> {
  const notifications = await NotificationDb.find<Notification>({
    user: userId,
  })
    .select("-expoToken -user")
    .sort({ createdAt: -1 });
  return notifications;
}

export async function sendSingleNotification(
  payload: ExpoMessage
): Promise<any> {
  const { title, body, user, error } = payload;
  const userAuth = await UserAuthDb.findOne<UserAuth>({ user });
  const pushTicket = await expo.sendPushNotificationsAsync([
    {
      to: userAuth!.expoToken,
      title,
      body,
      sound: "default",
    },
  ]);
  console.log(`push ticket ${pushTicket}`);

  const ticket = pushTicket[0];
  let ticketId = "";

  if (ticket.status === "error") {
    if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
      await UserAuthDb.updateOne({ user }, { $unset: { expoToken: 1 } });
    }
    throw new ServiceUnavailableError("invalid expoToke | expo service down");
  }
  if (ticket.status === "ok") {
    ticketId = ticket.id;
    console.log(`This is the ticket id${ticketId}`);
  }

  setTimeout(async (): Promise<void> => {
    const receipt = await expo.getPushNotificationReceiptsAsync([ticketId]);

    const recentReceipt = receipt[Object.keys(receipt)[0]];
    console.warn(recentReceipt);

    if (recentReceipt.status === "error") {
      if (recentReceipt.details?.error === "DeviceNotRegistered") {
        await UserAuthDb.updateOne({ user }, { $unset: { expoToken: 1 } });
      }
    }
  }, delayDuration);

  await NotificationDb.create({
    expoToken: userAuth!.expoToken,
    title,
    body,
    user,
    error,
  });
}

export async function batchNotificatons(payload: ExpoMessage) {
  const { title, body, user } = payload;

  const tokens: string[] = [];
  const userAuths = await UserAuthDb.find<UserAuth>({});
  for (const userAuth of userAuths) {
    tokens.push(...userAuth.expoToken);
  }

  const messages = [];
  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Invalid Expo Push Token: ${token}`);
      continue;
    }
    messages.push({
      to: token,
      title,
      body,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      const pushTicket = await expo.sendPushNotificationsAsync(chunk);
      const ticket = pushTicket[0];
      let ticketId = "";

      if (ticket.status === "error") {
        if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
          await UserAuthDb.updateOne({ user }, { $unset: { expoToken: 1 } });
        }
        throw new ServiceUnavailableError(
          "invalid expoToke | expo service down"
        );
      }
      if (ticket.status === "ok") {
        ticketId = ticket.id;
        console.log(`This is the ticket id${ticketId}`);
      }

      setTimeout(async (): Promise<void> => {
        const receipt = await expo.getPushNotificationReceiptsAsync([ticketId]);

        const recentReceipt = receipt[Object.keys(receipt)[0]];
        console.warn(recentReceipt);

        if (recentReceipt.status === "error") {
          if (recentReceipt.details?.error === "DeviceNotRegistered") {
            await UserAuthDb.updateOne({ user }, { $unset: { expoToken: 1 } });
          }
        }
      }, delayDuration);
    } catch (err) {
      console.log(err);
    }
  }
}
