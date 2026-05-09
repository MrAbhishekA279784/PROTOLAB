# Database Schema

## Overview
The application uses PostgreSQL (via Supabase). The schema separates e-commerce models from user project/simulation models.

## Core Tables

### `users`
- `id` (UUID, PK)
- `email` (String, Unique)
- `full_name` (String)
- `role` (Enum: USER, ADMIN)
- `created_at` (Timestamp)

### `products`
- `id` (UUID, PK)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `stock` (Integer)
- `type` (Enum: COMPONENT, KIT, PCB, 3D_PRINT)
- `simulation_model_id` (String) -> links to the simulation engine's internal model registry.

### `orders`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users)
- `status` (Enum: PENDING, PAID, SHIPPED, DELIVERED)
- `total_amount` (Decimal)
- `razorpay_order_id` (String)

### `order_items`
- `id` (UUID, PK)
- `order_id` (UUID, FK -> orders)
- `product_id` (UUID, FK -> products)
- `quantity` (Integer)
- `price_at_time` (Decimal)

### `projects`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users)
- `name` (String)
- `type` (Enum: SCHEMATIC, BREADBOARD, PCB)
- `data` (JSONB) -> Stores the entire serialized state of the Canvas (nodes, wires).
- `code` (Text) -> The current Arduino/C++ code attached to the project.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Relationships
- One-to-Many: `users` to `orders`
- One-to-Many: `users` to `projects`
- One-to-Many: `orders` to `order_items`
