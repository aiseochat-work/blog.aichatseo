ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_slug_unique";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_unique" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_tags_idx" ON "posts" USING gin ("tags");--> statement-breakpoint
CREATE OR REPLACE FUNCTION set_posts_updated_at()
RETURNS trigger AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
DROP TRIGGER IF EXISTS posts_set_updated_at ON posts;--> statement-breakpoint
CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_posts_updated_at();