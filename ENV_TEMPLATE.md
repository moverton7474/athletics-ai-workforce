# ENV_TEMPLATE.md

## Do not commit live secrets.

### Application
```env
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=athletics-ai-workforce
```

### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_PASSWORD=YOUR_DATABASE_PASSWORD
SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
SUPABASE_ACCESS_TOKEN=YOUR_SUPABASE_ACCESS_TOKEN
```

### CSOS Connector
```env
CSOS_CONNECTOR_MODE=cli
CSOS_CLI_PATH=/absolute/path/to/csos
CSOS_WORKDIR=/absolute/path/to/csos-working-copy
CSOS_ENV_PATH=/absolute/path/to/csos/.env
```

### Optional Integrations
```env
OPENAI_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

## Notes
- Frontend should only receive public-safe env vars.
- Service role keys must remain backend-only.
- CSOS credentials should be loaded only in connector runtime.
