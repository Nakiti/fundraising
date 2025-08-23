-- Stripe Integration Database Migration
-- Phase 1: Add Stripe-specific fields to support Connect and payment processing

-- Add Stripe fields to organizations table
ALTER TABLE organizations 
ADD COLUMN stripe_account_id VARCHAR(255) NULL,
ADD COLUMN stripe_account_status ENUM('pending', 'restricted', 'enabled') DEFAULT 'pending',
ADD COLUMN stripe_onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN stripe_details_submitted BOOLEAN DEFAULT FALSE,
ADD COLUMN stripe_charges_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add indexes for Stripe fields
ALTER TABLE organizations 
ADD INDEX idx_stripe_account_id (stripe_account_id),
ADD INDEX idx_stripe_status (stripe_account_status),
ADD INDEX idx_stripe_onboarding (stripe_onboarding_completed);

-- Add Stripe fields to transactions table
ALTER TABLE transactions 
ADD COLUMN stripe_payment_intent_id VARCHAR(255) NULL,
ADD COLUMN stripe_charge_id VARCHAR(255) NULL,
ADD COLUMN stripe_customer_id VARCHAR(255) NULL,
ADD COLUMN processing_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN net_amount DECIMAL(10,2) NULL,
ADD COLUMN application_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN refunded_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN stripe_status VARCHAR(50) NULL,
ADD COLUMN payment_method_type VARCHAR(50) DEFAULT 'card',
ADD COLUMN failure_reason TEXT NULL,
ADD COLUMN receipt_url VARCHAR(500) NULL;

-- Add indexes for Stripe transaction fields
ALTER TABLE transactions 
ADD INDEX idx_stripe_payment_intent (stripe_payment_intent_id),
ADD INDEX idx_stripe_charge (stripe_charge_id),
ADD INDEX idx_stripe_customer (stripe_customer_id),
ADD INDEX idx_stripe_status (stripe_status);

-- Create Stripe webhook events table for tracking and debugging
CREATE TABLE stripe_webhook_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stripe_event_id VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processing_attempts INT DEFAULT 0,
    error_message TEXT NULL,
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    INDEX idx_event_id (stripe_event_id),
    INDEX idx_event_type (event_type),
    INDEX idx_processed (processed),
    INDEX idx_created_at (created_at)
);

-- Create Stripe Connect accounts tracking table
CREATE TABLE stripe_connect_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    stripe_account_id VARCHAR(255) NOT NULL UNIQUE,
    account_type VARCHAR(50) DEFAULT 'standard',
    country VARCHAR(2) DEFAULT 'US',
    email VARCHAR(255),
    business_profile JSON,
    requirements JSON,
    capabilities JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_org_id (organization_id),
    INDEX idx_stripe_account (stripe_account_id),
    INDEX idx_active (is_active)
);

-- Update existing transactions to set default values for new fields
UPDATE transactions 
SET net_amount = amount 
WHERE net_amount IS NULL;

-- Add constraints to ensure data integrity
ALTER TABLE transactions 
ADD CONSTRAINT chk_net_amount CHECK (net_amount >= 0),
ADD CONSTRAINT chk_processing_fee CHECK (processing_fee >= 0),
ADD CONSTRAINT chk_application_fee CHECK (application_fee >= 0),
ADD CONSTRAINT chk_refunded_amount CHECK (refunded_amount >= 0);

-- Add comments for documentation
ALTER TABLE organizations 
MODIFY COLUMN stripe_account_id VARCHAR(255) NULL COMMENT 'Stripe Connect account ID for receiving payments',
MODIFY COLUMN stripe_account_status ENUM('pending', 'restricted', 'enabled') DEFAULT 'pending' COMMENT 'Current status of Stripe Connect account',
MODIFY COLUMN stripe_onboarding_completed BOOLEAN DEFAULT FALSE COMMENT 'Whether Stripe Connect onboarding is complete';

ALTER TABLE transactions 
MODIFY COLUMN stripe_payment_intent_id VARCHAR(255) NULL COMMENT 'Stripe Payment Intent ID for this transaction',
MODIFY COLUMN stripe_charge_id VARCHAR(255) NULL COMMENT 'Stripe Charge ID after payment completion',
MODIFY COLUMN processing_fee DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Stripe processing fee for this transaction',
MODIFY COLUMN net_amount DECIMAL(10,2) NULL COMMENT 'Amount after fees that organization receives';
