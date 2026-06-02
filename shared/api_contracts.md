# VYRA Shared API Contracts

Base: `/api/v1`

## Auth
- `POST /auth/register` — email/phone, password, username, displayName
- `POST /auth/login`
- `POST /auth/refresh` — `{ refreshToken }`
- `GET /auth/me` — Bearer token

## Socket events
| Client emit | Server emit |
|-------------|-------------|
| `chat:join` | `chat:message` |
| `chat:message` | `chat:edited` |
| `typing:start` | `typing:start` |
| `presence:update` | `presence:changed` |
| — | `notification:new` |

Auth: `handshake.auth.token` = JWT access token
