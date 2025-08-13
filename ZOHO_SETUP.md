# Zoho CRM Integration Setup Guide

## Overview
This document provides step-by-step instructions for integrating the myBlueprint Career Launch landing page with Zoho CRM for email capture and lead management.

## Prerequisites
- Zoho CRM account with API access
- Administrator privileges to create custom applications
- Basic understanding of OAuth 2.0 authentication

## Step 1: Create Zoho Application

1. **Log into Zoho API Console**
   - Go to https://api-console.zoho.com/
   - Sign in with your Zoho account

2. **Create New Application**
   - Click "Add Client"
   - Choose "Server-based Applications"
   - Fill in application details:
     - Client Name: `myBlueprint Career Launch Landing Page`
     - Homepage URL: `https://your-domain.com`
     - Authorized Redirect URIs: `https://your-domain.com/oauth/callback`

3. **Note Your Credentials**
   - Save Client ID and Client Secret securely

## Step 2: Generate Access Token

### Method 1: Using Zoho OAuth Playground (Recommended for Testing)

1. Go to https://accounts.zoho.com/developerconsole
2. Select your application
3. Generate authorization code with scopes: `ZohoCRM.modules.ALL`
4. Exchange authorization code for access token

### Method 2: Manual OAuth Flow

```bash
# Step 1: Get authorization code
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI

# Step 2: Exchange code for token
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI" \
  -d "code=AUTHORIZATION_CODE"
```

## Step 3: Configure Environment Variables

1. **Copy Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Update Configuration**
   ```env
   ZOHO_ENDPOINT=https://www.zohoapis.com/crm/v2/Leads
   ZOHO_AUTH_TOKEN=your_actual_access_token
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ZOHO_REFRESH_TOKEN=your_refresh_token
   ```

## Step 4: Test Integration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Form Submission**
   - Open http://localhost:3000
   - Submit test email
   - Verify lead creation in Zoho CRM

## Step 5: Production Deployment

### Environment Variables Setup
Set the following environment variables in your hosting platform:

```bash
ZOHO_ENDPOINT=https://www.zohoapis.com/crm/v2/Leads
ZOHO_AUTH_TOKEN=your_production_token
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
NODE_ENV=production
```

### Token Refresh Strategy
Implement automatic token refresh to handle expired tokens:

```javascript
// Add to js/main.js
async refreshToken() {
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: this.zohoConfig.clientId,
            client_secret: this.zohoConfig.clientSecret,
            refresh_token: this.zohoConfig.refreshToken
        })
    });
    
    const data = await response.json();
    this.zohoConfig.authToken = data.access_token;
    return data.access_token;
}
```

## Step 6: CRM Configuration

### Lead Fields Mapping
The application sends the following data to Zoho:

| Form Field | Zoho CRM Field | Type | Required |
|------------|---------------|------|----------|
| Email | Email | Email | Yes |
| Lead Source | Lead_Source | Picklist | Auto-set |
| Lead Status | Lead_Status | Picklist | Auto-set |
| Company | Company | Text | Auto-set |
| Last Name | Last_Name | Text | Auto-set |
| Description | Description | Text Area | Auto-set |

### Recommended Zoho Setup

1. **Create Custom Fields**
   - `Event_Interest`: Picklist with "Career Launch" option
   - `Signup_Date`: Date field for tracking
   - `Source_Page`: Text field for tracking

2. **Setup Automation Rules**
   - Auto-assign leads to appropriate team member
   - Send confirmation email to lead
   - Create follow-up task for agenda release

3. **Create Lead Source**
   - Add "Career Launch Landing Page" as lead source option

## Step 7: Monitoring & Analytics

### Error Tracking
Monitor the following errors:
- Authentication failures (401 responses)
- Rate limit exceeded (429 responses)
- Invalid data format (400 responses)

### Success Metrics
Track these KPIs:
- Form submission rate
- Successful CRM integration rate
- Lead quality scores
- Conversion timeline

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Implement request rate limiting** to prevent abuse
4. **Validate and sanitize** all input data
5. **Use HTTPS** for all API communications
6. **Regularly rotate** access tokens

## Troubleshooting

### Common Issues

**401 Unauthorized**
- Check access token validity
- Verify token has correct scopes
- Refresh expired token

**400 Bad Request**
- Validate JSON payload format
- Check required field mappings
- Ensure data types match Zoho requirements

**Rate Limiting**
- Implement exponential backoff
- Cache successful requests
- Consider webhook alternatives for high volume

### Testing Commands

```bash
# Test token validity
curl -H "Authorization: Zoho-oauthtoken YOUR_TOKEN" \
  https://www.zohoapis.com/crm/v2/org

# Test lead creation
curl -X POST https://www.zohoapis.com/crm/v2/Leads \
  -H "Authorization: Zoho-oauthtoken YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":[{"Email":"test@example.com","Last_Name":"Test"}]}'
```

## Support

For technical support:
- Zoho CRM API Documentation: https://www.zoho.com/crm/developer/docs/
- Zoho Developer Community: https://help.zoho.com/portal/community
- myBlueprint Development Team: [internal contact]

## Backup Plan

If Zoho integration fails:
1. Form submissions are logged to browser console
2. Consider alternative CRM integrations (HubSpot, Salesforce)
3. Implement email-based fallback system
4. Use webhook services (Zapier, Make.com) as intermediary