import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import redis from "./redis";

export function MongoDBRedisAdapter(clientPromise: Promise<any>): Adapter {
  const mongoAdapter = MongoDBAdapter(clientPromise);

  return {
    ...mongoAdapter,
    
    // Override Session Methods to use Redis
    
    async createSession(session) {
      const sessionKey = `session:${session.sessionToken}`;
      // Store session in Redis with 24 hours TTL
      await redis.setex(sessionKey, 24 * 60 * 60, JSON.stringify(session));
      return session as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      const sessionKey = `session:${sessionToken}`;
      const sessionData = await redis.get(sessionKey);
      
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData) as AdapterSession;
      
      // Parse the ISO date string back into a Date object
      session.expires = new Date(session.expires);
      
      // Retrieve the user from MongoDB using the base adapter
      const user = await mongoAdapter.getUser!(session.userId);
      if (!user) return null;
      
      return { session, user: user as AdapterUser };
    },

    async updateSession(session) {
      const sessionKey = `session:${session.sessionToken}`;
      const sessionData = await redis.get(sessionKey);
      
      if (!sessionData) return null;
      
      const parsedSession = JSON.parse(sessionData) as AdapterSession;
      const updatedSession = { ...parsedSession, ...session };
      
      let ttl = 24 * 60 * 60; // 24 hours default
      if (updatedSession.expires) {
        // Calculate remaining seconds if expires is modified
        ttl = Math.max(0, Math.floor((new Date(updatedSession.expires).getTime() - Date.now()) / 1000));
      }

      await redis.setex(sessionKey, ttl, JSON.stringify(updatedSession));
      
      updatedSession.expires = new Date(updatedSession.expires);
      return updatedSession as AdapterSession;
    },

    async deleteSession(sessionToken) {
      const sessionKey = `session:${sessionToken}`;
      const sessionData = await redis.get(sessionKey);
      
      if (!sessionData) return null;
      
      await redis.del(sessionKey);
      
      const session = JSON.parse(sessionData) as AdapterSession;
      session.expires = new Date(session.expires);
      return session;
    }
  };
}
