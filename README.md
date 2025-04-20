# 🛠️ InfraCRM

CRM-система для мониторинга серверов, сервисов и управления заявками GLPI.  
Построена на стеке **Laravel 11**, **Inertia.js**, **React**, **shadcn/ui**.

---

## 🚀 Возможности

- 📊 Мониторинг состояния сервисов и серверов
- 🎫 Интеграция с GLPI для работы с заявками
- 👥 Управление пользователями и ролями
- 🛎 Уведомления о сбоях
- 📁 Дашборд с ключевыми метриками

---

## 🧰 Стек технологий

- **Backend**: Laravel 11
- **Frontend**: Inertia.js + React
- **UI Kit**: shadcn/ui (Tailwind CSS)
- **База данных**: MySQL / PostgreSQL
- **Прочее**: Axios, Ziggy, Laravel Sanctum

---

## ⚙️ Установка

```bash
git clone https://github.com/твоя-организация/infra-crm.git
cd infra-crm

cp .env.example .env
composer install
npm install
php artisan key:generate

php artisan migrate --seed
npm run dev
