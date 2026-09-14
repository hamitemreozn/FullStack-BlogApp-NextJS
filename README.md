# Astrology Blog App

`Astrology Blog App`, eski Next.js/MongoDB/Firebase projesinin yerelde, üretime taşınabilir biçimde yeniden kurulmuş sürümüdür. Eski kaynak kodu silinmeden `legacy-source/` altında referans olarak tutulur; çalışan uygulama yalnızca `src/` içindedir.

## Teknoloji seçimi

- Next.js 16, React 19 ve TypeScript
- PostgreSQL 17 ve Kysely
- Better Auth: yerel e-posta/parola oturumu ve admin rolü
- MinIO: yerelde S3 uyumlu özel medya deposu
- Cloudflare R2: üretimde aynı S3 arayüzünün hedefi olacak

Eski Firebase, MongoDB, Prisma, NextAuth ve GitHub OAuth entegrasyonları çalışır kodda bulunmaz. Google ile giriş, yeni ve geliştiriciye ait OAuth bilgileriyle ileride isteğe bağlı eklenebilir.

## Yerel kurulum

Ön koşullar: Node.js 20.9+ ve Docker Desktop.

```powershell
Copy-Item .env.example .env
docker compose up -d
npm install
npm run db:migrate:content
npm run storage:setup
npm run dev
```

Uygulama `http://localhost:3000`, yönetim girişi `http://localhost:3000/admin/login`, MinIO konsolu `http://localhost:9003` adresindedir. Bu proje Docker’da kendine özgü adlar, portlar (`5433`, `9002`, `9003`) ve volume’lar kullanır; başka bir projenin MinIO’suna dokunmaz.

İlk yerel yönetici, Better Auth komutuyla oluşturulur:

```powershell
npx auth@latest create-admin --config src/lib/auth-cli.ts --email admin@astrology.local --name "Local Administrator" --role admin --password "choose-a-unique-local-password" --yes
```

Bu parola yalnızca yerel geliştirme içindir; gerçek bir proje parolasını repoya veya `.env.example` dosyasına yazma.

## Kalite komutları

```powershell
npm run format
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Yerel servisler ve ilerideki R2 geçişi için [local services notlarına](docs/local-services.md), yeniden yapım sırası için [plana](docs/rebuild-plan.md) bak.
