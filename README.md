# 🌤️ Klimate

[![Deploy](https://img.shields.io/badge/Vercel-Live-success?logo=vercel)](https://klimate-ecru.vercel.app/)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-ff69b4)
![Shadcn](https://img.shields.io/badge/UI-shadcn/ui-black?logo=radixui)
![Weather API](https://img.shields.io/badge/API-OpenWeatherAPI-orange)

> Веб-сервис прогноза погоды с геолокацией и избранными городами.  
> Построен на **React + TypeScript + TailwindCSS** с использованием **TanStack Query**.

---

## 🚀 Demo
🔗 [Открыть проект на Vercel](https://klimate-ecru.vercel.app/)

---

## ✨ Features

- 🌍 Определение погоды по **текущей геолокации**
- 🔎 **Поиск городов** с автодополнением
- ⭐ Добавление городов в **избранное**
- 📊 Дэшборд с текущей погодой и прогнозом
- ⚡ Оптимизация запросов через **TanStack Query**

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI  
- **State/Query**: TanStack Query  
- **API**: [OpenWeather API]([https://www.weatherapi.com/](https://openweathermap.org/api)) (погода), [Geocoding API](https://openweathermap.org/api/geocoding-api) (геолокация)  
- **Deploy**: Vercel  

---

## 📸 Screenshots

| Главный экран | Поиск по городам | Страница города |
|---------------|------------------|-----------------|
| ![dashboard](./screenshots/dashboard.png) | ![search](./screenshots/search.png) | ![city page](./screenshots/city-page.png)

---

## ⚙️ Установка и запуск

```bash
# Клонировать проект
git clone https://github.com/yourusername/klimate.git

# Перейти в папку проекта
cd klimate

# Установить зависимости
npm install

# Запустить проект
npm run dev
````