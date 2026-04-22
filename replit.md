# نوافذ الغد للخدمات اللوجستية

## Overview

موقع تعريفي لشركة نوافذ الغد للخدمات اللوجستية مع نظام تسجيل المناديب ولوحة إدارة.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Routing**: Wouter

## Pages

- `/` — الصفحة الرئيسية التعريفية (خدمات، إحصائيات، شركاء، آراء عملاء، تواصل)
- `/register` — نموذج تسجيل المناديب
- `/admin` — لوحة إدارة طلبات المناديب (عرض، قبول، رفض، حذف)

## Database Tables

- `mandoob_registrations` — طلبات تسجيل المناديب (الاسم، الجوال، الهوية، المدينة، المركبة، الرخصة، الخبرة، الحالة)

## API Endpoints

- `GET /api/mandoob` — قائمة طلبات التسجيل (مع فلتر status اختياري)
- `POST /api/mandoob` — تسجيل مندوب جديد
- `GET /api/mandoob/stats` — إحصائيات (إجمالي، قيد المراجعة، مقبول، مرفوض)
- `PATCH /api/mandoob/:id` — تحديث حالة المندوب
- `DELETE /api/mandoob/:id` — حذف سجل

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Design

- اللون الرئيسي: أزرق مستوحى من لوجو الشركة
- الخط: Cairo (عربي)
- الاتجاه: RTL
