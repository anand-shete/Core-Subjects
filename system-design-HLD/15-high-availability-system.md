## Questions

1. Design Data Resilient architecture
2. Design a system to achieve 99.999% uptime
3. Design system to avoid Single Point of Failure
4. Active Passive vs Active-Active architecture

## Mutli-Node architecture

1. Active-Passive
2. Active-Active

### Active-Passive (Primary-Replica / Master-Slave)

Global DNS routes 100% of all user traffic to the Active Data Center. The Passive (DR) Data Center is a dormant backup.
Only the Primary DB accepts writes; changes are replicated to the Passive DB replica.

- **Cons:**
  - High latency for global users far from the single active region.
  - Failover causes temporary write downtime (High Recovery Time Objective (RTO)).
  - Risk of losing un-replicated data during a sudden crash (High Recovery Point Objective (RPO)).
  - Wasted money keeping idle standby infrastructure.

### Active-Active (Multi-Master)

Global DNS routes users to the nearest Data Center. Both regions are actively processing reads and writes simultaneously.

- **Data Flow:** Continuous bi-directional synchronization keeps both databases updated.
- **Pros:** Ultra-low latency worldwide and near-zero downtime if one region dies.
- **Cons:** Extreme architectural complexity due to **Write Conflicts** (e.g., two users updating the same record in different regions at the same time).
