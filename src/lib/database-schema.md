# NextGenRDP Database Schema Design

This document outlines the database schema design for the NextGenRDP website, providing a structured approach to managing RDP/VPS products, user accounts, orders, and service provisioning.

## Current Database Structure

The current implementation uses PostgreSQL with the following tables:

- `users`: Stores user account information
- `orders`: Tracks customer orders
- `order_items`: Links orders to specific plans
- `plans`: Stores plan information (currently hardcoded in `src/data/plans.js`)

## Improved Database Schema

### Users and Authentication

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Products and Plans

```sql
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE plans (
  id VARCHAR(50) PRIMARY KEY, -- e.g., 'rdp-starter-one'
  category_id INTEGER REFERENCES product_categories(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cpu VARCHAR(50) NOT NULL, -- e.g., '2 vCore'
  ram VARCHAR(50) NOT NULL, -- e.g., '4 GB RAM'
  storage VARCHAR(100) NOT NULL, -- e.g., '30 GB NVMe SSD'
  bandwidth VARCHAR(50) NOT NULL, -- e.g., '500 GB'
  os VARCHAR(100), -- e.g., 'Windows Server 2022'
  price_pkr INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  theme_color VARCHAR(20) DEFAULT 'sky',
  label VARCHAR(50), -- e.g., 'Recommended', 'Most Selling'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plan_features (
  id SERIAL PRIMARY KEY,
  plan_id VARCHAR(50) REFERENCES plans(id) ON DELETE CASCADE,
  feature TEXT NOT NULL
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  city VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);
```

### Orders and Billing

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL, -- 'pending_payment', 'paid', 'processing', 'active', 'cancelled', 'expired'
  total_amount_pkr INTEGER NOT NULL,
  discount_amount_pkr INTEGER DEFAULT 0,
  final_amount_pkr INTEGER NOT NULL,
  promo_code VARCHAR(50),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) REFERENCES plans(id),
  location_id INTEGER REFERENCES locations(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_order_pkr INTEGER NOT NULL,
  validity_months INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value INTEGER NOT NULL, -- percentage or amount in PKR
  min_order_value INTEGER DEFAULT 0,
  max_discount_amount INTEGER,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Service Provisioning and Management

```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER REFERENCES order_items(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  service_type VARCHAR(20) NOT NULL, -- 'rdp', 'vps'
  status VARCHAR(20) NOT NULL, -- 'provisioning', 'active', 'suspended', 'terminated'
  hostname VARCHAR(255),
  ip_address VARCHAR(45),
  username VARCHAR(100),
  password_encrypted VARCHAR(255), -- Store encrypted, not plaintext
  server_id VARCHAR(100), -- Reference to actual server/VM ID in hosting system
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_renewal_date TIMESTAMP WITH TIME ZONE,
  next_renewal_date TIMESTAMP WITH TIME ZONE,
  termination_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE service_logs (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'create', 'suspend', 'resume', 'terminate', 'password_reset', etc.
  status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'pending'
  details TEXT,
  performed_by INTEGER REFERENCES users(id), -- admin user who performed action, if applicable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Strategy

1. **Migrate from Hardcoded Data**: Move plan data from `src/data/plans.js` to the database
2. **API Endpoints**: Create RESTful API endpoints for all database operations
3. **Authentication Flow**: Implement proper JWT-based authentication with session management
4. **Order Processing**: Create a complete order flow with payment integration
5. **Service Provisioning**: Implement automated or manual service provisioning after payment

## Database Access Layer

The current implementation in `src/lib/db.ts` provides a solid foundation with connection pooling and error handling. This should be extended with:

1. **Repository Pattern**: Create separate repository files for each entity (users, plans, orders, etc.)
2. **Transaction Support**: Enhance transaction handling for operations that span multiple tables
3. **Data Validation**: Implement consistent validation at the database layer

## Frontend Integration

1. **Data Fetching**: Replace hardcoded data with API calls
2. **State Management**: Implement proper state management for user sessions and cart
3. **Form Handling**: Enhance form validation and error handling

## Security Considerations

1. **Password Storage**: Continue using bcrypt for password hashing
2. **JWT Tokens**: Implement proper token expiration and refresh mechanisms
3. **Service Credentials**: Encrypt sensitive service credentials (RDP/VPS passwords)
4. **Input Validation**: Validate all user inputs to prevent SQL injection

## Monitoring and Maintenance

1. **Database Migrations**: Implement a migration system for schema changes
2. **Performance Monitoring**: Add query performance monitoring
3. **Backup Strategy**: Implement regular database backups

This schema design provides a solid foundation for a scalable RDP/VPS selling platform while addressing the current limitations in the database implementation.