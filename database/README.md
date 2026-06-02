# Vyra database

PostgreSQL schema is defined in `../server/prisma/schema.prisma`.

```powershell
cd D:\Vyra\server
npx prisma migrate dev --name init
npx prisma db seed
```

Tables include: users, profiles, posts, messages, communities, interest_galaxies, dream_boards, ai_memories, social_energy_log, and more.
