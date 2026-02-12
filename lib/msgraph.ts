import { ConfidentialClientApplication } from '@azure/msal-node'
import { Client } from '@microsoft/microsoft-graph-client'

export interface MSGraphConfig {
  clientId: string
  clientSecret: string
  tenantId: string
  redirectUri: string
}

export class MSGraphClient {
  private msalClient: ConfidentialClientApplication
  private config: MSGraphConfig

  constructor(config: MSGraphConfig) {
    this.config = config
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
        clientSecret: config.clientSecret,
      },
    })
  }

  async getAccessToken(): Promise<string> {
    try {
      const result = await this.msalClient.acquireTokenByClientCredential({
        scopes: ['https://graph.microsoft.com/.default'],
      })

      if (!result || !result.accessToken) {
        throw new Error('Failed to acquire access token')
      }

      return result.accessToken
    } catch (error) {
      console.error('Error acquiring token:', error)
      throw error
    }
  }

  async getClient(): Promise<Client> {
    const accessToken = await this.getAccessToken()

    return Client.init({
      authProvider: (done) => {
        done(null, accessToken)
      },
    })
  }

  async getUnreadMessages() {
    try {
      const client = await this.getClient()
      
      // Get messages from the last 24 hours that are unread
      const messages = await client
        .api('/me/messages')
        .filter('isRead eq false')
        .orderby('receivedDateTime desc')
        .top(50)
        .get()

      return messages.value || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  }

  async getChatMessages() {
    try {
      const client = await this.getClient()
      
      // Get recent chats
      const chats = await client
        .api('/me/chats')
        .get()

      return chats.value || []
    } catch (error) {
      console.error('Error fetching chats:', error)
      throw error
    }
  }
}

export function createMSGraphClient(
  clientId?: string,
  clientSecret?: string,
  tenantId?: string,
  redirectUri?: string
): MSGraphClient {
  return new MSGraphClient({
    clientId: clientId || process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: clientSecret || process.env.MICROSOFT_CLIENT_SECRET || '',
    tenantId: tenantId || process.env.MICROSOFT_TENANT_ID || '',
    redirectUri: redirectUri || process.env.MICROSOFT_REDIRECT_URI || '',
  })
}
