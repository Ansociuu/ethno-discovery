# EthnoDiscovery Backend — Railway/Render Deploy

## Build Command
```
npm run build
```

## Start Command
```
npm run start:prod
```

## Environment Variables cần set trên Railway/Render:

```env
DATABASE_URL=mysql://...
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=drvjjrsah
CLOUDINARY_API_KEY=738588918388955
CLOUDINARY_API_SECRET=vvAeE5f4GCUU2KpKbyVRwjnrKf8

GEMINI_API_KEY=AIzaSyAsjub39JBtC1Dve6hMoton5hmzvmLDfKM

SEPAY_API_KEY=<your_sepay_key>
SEPAY_WEBHOOK_SECRET=<your_webhook_secret>
SEPAY_ACCOUNT_NUMBER=<your_account>
SEPAY_BANK_CODE=VCB
SEPAY_ACCOUNT_NAME=ETHNO DISCOVERY

PORT=5000
NODE_ENV=production
FRONTEND_URL=https://ethnodiscovery.vercel.app
BACKEND_URL=https://ethnodiscovery-api.railway.app
```
