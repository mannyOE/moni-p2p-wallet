-- trigger function
CREATE OR REPLACE FUNCTION after_wallets_modify_method()
RETURNS TRIGGER AS $$
DECLARE
  notification_payload JSON;
BEGIN
    notification_payload := to_json(NEW);
    PERFORM pg_notify('wallet_changed'::text, notification_payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_wallet_modify ON wallets;

CREATE TRIGGER after_wallet_modify
AFTER UPDATE ON wallets
FOR EACH ROW
EXECUTE PROCEDURE after_wallets_modify_method();

DROP TRIGGER IF EXISTS after_insert_wallet ON wallets;

CREATE TRIGGER after_insert_wallet
AFTER INSERT ON wallets
FOR EACH ROW
EXECUTE PROCEDURE after_wallets_modify_method();
