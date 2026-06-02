-- VyraWorlds, RealityBoards, Community threads/votes, VerificationToken

CREATE TABLE "vyra_worlds" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_url" TEXT,
    "theme_color" TEXT,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "vyra_worlds_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "vyra_worlds_slug_key" ON "vyra_worlds"("slug");

CREATE TABLE "world_members" (
    "id" TEXT NOT NULL,
    "world_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "world_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "world_members_world_id_user_id_key" ON "world_members"("world_id", "user_id");
CREATE INDEX "world_members_user_id_idx" ON "world_members"("user_id");
ALTER TABLE "world_members" ADD CONSTRAINT "world_members_world_id_fkey" FOREIGN KEY ("world_id") REFERENCES "vyra_worlds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "world_members" ADD CONSTRAINT "world_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "reality_boards" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vision_text" TEXT NOT NULL,
    "pillars_json" JSONB NOT NULL DEFAULT '[]',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "reality_boards_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "reality_boards_user_id_idx" ON "reality_boards"("user_id");
ALTER TABLE "reality_boards" ADD CONSTRAINT "reality_boards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "community_threads" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "community_threads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "community_threads_community_id_idx" ON "community_threads"("community_id");
CREATE INDEX "community_threads_author_id_idx" ON "community_threads"("author_id");
ALTER TABLE "community_threads" ADD CONSTRAINT "community_threads_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_threads" ADD CONSTRAINT "community_threads_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "community_votes" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "community_votes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "community_votes_thread_id_user_id_key" ON "community_votes"("thread_id", "user_id");
CREATE INDEX "community_votes_thread_id_idx" ON "community_votes"("thread_id");
ALTER TABLE "community_votes" ADD CONSTRAINT "community_votes_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "community_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_votes" ADD CONSTRAINT "community_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE INDEX "verification_tokens_token_idx" ON "verification_tokens"("token");
CREATE INDEX "verification_tokens_email_idx" ON "verification_tokens"("email");
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
