import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private readonly oneSignalAppId = 'fce039a5-32dc-4317-b70a-2e1e0b3f7a83';
  private oneSignalReady: Promise<void>;

  constructor() {
    // Initialize OneSignal on service construction and set the promise to `oneSignalReady`
    this.oneSignalReady = this.initializeOneSignal();
  }

  public initializeOneSignal(): Promise<void> {
    return new Promise((resolve) => {
      const checkOneSignal = setInterval(() => {
        if (typeof (window as any).OneSignal !== 'undefined') {
          clearInterval(checkOneSignal);
          this.setupOneSignal();
          resolve(); // Resolve the promise when OneSignal is initialized
        }
      }, 100);
    });
  }

  private setupOneSignal(): void {
    const OneSignal = (window as any).OneSignal || [];
    OneSignal.push(() => {
      OneSignal.init({
        appId: this.oneSignalAppId,
        notifyButton: {
          enable: true,
        },
      });

      OneSignal.isPushNotificationsEnabled((isEnabled: boolean) => {
        console.log(isEnabled ? 'Push notifications are enabled!' : 'Push notifications are not enabled yet.');
      });

      OneSignal.on('subscriptionChange', (isSubscribed: boolean) => {
        console.log('Subscription status changed:', isSubscribed);
      });
    });
  }

  // Prompts user for notification permissions
  async promptForNotificationPermission(): Promise<void> {
    await this.oneSignalReady; // Wait until OneSignal is ready

    const OneSignal = (window as any).OneSignal;
    OneSignal.push(() => {
      OneSignal.showNativePrompt();
    });
  }

  // Sends a tag with specified key and value
  async sendTag(key: string, value: string): Promise<void> {
    await this.oneSignalReady; // Wait until OneSignal is ready

    const OneSignal = (window as any).OneSignal;
    OneSignal.push(() => {
      OneSignal.sendTag(key, value)
        .then(() => console.log(`Tag sent: ${key} = ${value}`))
        .catch((error: any) => console.error('Error sending tag:', error));
    });
  }

  // Sends a notification with specified title and message
  async sendNotification(title: string, message: string): Promise<void> {
    const OneSignal = (window as any).OneSignal;
    OneSignal.push(() => {
      OneSignal.postNotification(
        {
          contents: { en: message },
          headings: { en: title },
          included_segments: ['All'], // Send to all users
        },
        (success: any) => {
          alert("notificación correcta!");
          console.log('Notification sent successfully:', success);
        },
        (error: any) => {
          alert("error: " + error);
          console.error('Error sending notification:', error);
        }
      );
    });
  }
}