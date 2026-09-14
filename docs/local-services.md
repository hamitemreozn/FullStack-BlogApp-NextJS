# Local services

This application owns its local services. It does not share a database, MinIO bucket, Docker volume, port, credential, or container with another project.

## First run

1. Copy `.env.example` to `.env` and replace every placeholder value.
2. Start the application-specific services with `docker compose up -d`.
3. PostgreSQL is available only to this project at `localhost:5433`.
4. MinIO's S3 API is available at `http://localhost:9002`; its local console is at `http://localhost:9003`.
5. Run `npm run storage:setup` once. It creates only the `astrology-media` bucket. Browser upload CORS is restricted at the project-owned MinIO server to this app's local origin.

Docker Compose uses the `astrology-blog-app` project name, unique container names, ports, and named volumes. It cannot stop or delete a different project's MinIO container or its data.

## Production mapping

The application will use the S3 API, not a MinIO-only API. Local MinIO settings can therefore later be replaced by a developer-owned Cloudflare R2 endpoint, bucket, and credentials without changing application code.

The bucket is private: the browser receives a 60-second, single-object, size- and MIME-type-restricted upload form only after an administrator session is checked. In production, create the R2 bucket and a least-privilege API token through the Cloudflare dashboard/IaC; do not run the local setup command against production.
