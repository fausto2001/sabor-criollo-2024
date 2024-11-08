import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private readonly oneSignalAppId = 'fce039a5-32dc-4317-b70a-2e1e0b3f7a83';
  private readonly oneSignalApiKey = 'MjY5Yzc0YTEtOGNiYy00ZGM3LWFlNDctOGQ0OWVhMTliMWQ5';
  private oneSignalReady: Promise<void>;

  constructor(private http: HttpClient) {
    this.oneSignalReady = this.initializeOneSignal();
  }

  /**
   * Initializes OneSignal by checking for its presence in the global window.
   * Resolves only after OneSignal is ready to be used.
   */
  public initializeOneSignal(): Promise<void> {
    Log.d("initializeOneSignal called"); // Debugging log
    return new Promise((resolve) => {
      const checkOneSignal = setInterval(() => {
        console.log("Checking for OneSignal SDK...");
        if (typeof (window as any).OneSignal !== 'undefined') {
          clearInterval(checkOneSignal);
          console.log("OneSignal SDK loaded successfully");
          this.setupOneSignal();
          resolve();
        }
      }, 100);
    });
  }
  
  private setupOneSignal(): void {
    console.log("setupOneSignal called"); // Debugging log
    const OneSignal = (window as any).OneSignal || [];
    OneSignal.push(() => {
      console.log("OneSignal init function running"); // Log that init function is being triggered
      OneSignal.init({
        appId: this.oneSignalAppId,
        notifyButton: { enable: true },
      });
      OneSignal.isPushNotificationsEnabled((isEnabled: boolean) => {
        alert(isEnabled ? 'Push notifications are enabled!' : 'Push notifications are not enabled yet.');
      });
      OneSignal.on('subscriptionChange', (isSubscribed: boolean) => {
        alert('Subscription status changed:' + isSubscribed);
      });
    });
  }  

  /**
   * Prompts the user to allow notification permissions.
   */
  async promptForNotificationPermission(): Promise<void> {
    await this.oneSignalReady;
    const OneSignal = (window as any).OneSignal;

    OneSignal.push(() => {
      OneSignal.showSlidedownPrompt()
        .then(() => console.log('User prompted to enable notifications'))
        .catch((error: any) => console.error('Error showing prompt:', error));
    });
  }

  /**
   * Sends a tag to the user's OneSignal data for segmentation.
   * @param key - The tag key
   * @param value - The tag value
   */
  async sendTag(key: string, value: string): Promise<void> {
    await this.oneSignalReady;
    const OneSignal = (window as any).OneSignal;

    OneSignal.push(() => {
      OneSignal.sendTag(key, value)
        .then(() => console.log(`Tag sent: ${key} = ${value}`))
        .catch((error: any) => console.error('Error sending tag:', error));
    });
  }

  /**
   * Sends a push notification to all subscribed users.
   * @param title - Notification title
   * @param message - Notification message
   */
  async sendNotification(title: string, message: string): Promise<void> {
    const url = 'https://onesignal.com/api/v1/notifications';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${this.oneSignalApiKey}`
    });

    const payload = {
      app_id: this.oneSignalAppId,
      headings: { en: title },
      contents: { en: message },
      included_segments: ['All'] // Send to all subscribed users
    };

    try {
      const response = await this.http.post(url, payload, { headers }).toPromise();
      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Checks if the user is subscribed and prompts for subscription if not.
   */
  async checkAndPromptForSubscription(): Promise<void> {
    await this.oneSignalReady;
    const OneSignal = (window as any).OneSignal;

    OneSignal.push(() => {
      OneSignal.isPushNotificationsEnabled((isEnabled: boolean) => {
        if (!isEnabled) {
          OneSignal.showSlidedownPrompt()
            .then(() => console.log("User prompted to enable notifications"))
            .catch((error: any) => console.error("Error prompting for notifications:", error));
        } else {
          console.log("User is already subscribed to notifications");
        }
      });
    });
  }
}