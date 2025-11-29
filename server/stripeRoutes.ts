import express, { type Express } from 'express';
import { storage } from './storage';
import { stripeService } from './stripeService';

export function registerStripeRoutes(app: Express) {
  // Get user subscription
  app.get('/api/subscription', async (req: any, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await storage.getUser(req.user.id);
      if (!user?.stripeSubscriptionId) {
        return res.json({ subscription: null });
      }

      const subscription = await stripeService.getSubscription(user.stripeSubscriptionId);
      res.json({ subscription });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create checkout session
  app.post('/api/checkout', async (req: any, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await storage.getUser(req.user.id);
      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'priceId required' });
      }

      // Create or get customer
      let customerId = user?.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user?.email || '', req.user.id);
        await storage.updateUserStripeInfo(req.user.id, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }

      // Create checkout session
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${req.protocol}://${req.get('host')}/checkout/success`,
        `${req.protocol}://${req.get('host')}/checkout/cancel`
      );

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.listProducts();
      res.json({ data: products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List products with prices
  app.get('/api/products-with-prices', async (req, res) => {
    try {
      const rows = await storage.listProductsWithPrices();

      const productsMap = new Map();
      for (const row of rows) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List prices
  app.get('/api/prices', async (req, res) => {
    try {
      const prices = await storage.listProducts();
      res.json({ data: prices });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get prices for a specific product
  app.get('/api/products/:productId/prices', async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const prices = await storage.getPricesForProduct(productId);
      res.json({ data: prices });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
