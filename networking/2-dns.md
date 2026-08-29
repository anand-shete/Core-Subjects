## DNS Resolver

The first stop. Managed by your Internet Service Provider (ISP) or third parties (e.g. Google Public DNS `8.8.8.8`). It acts as an intermediary, querying other servers on your behalf.

## Root Nameservers

Root nameservers point the DNS resolver to the correct Top Level Domain (TLD) server. They store the location of TLD registries. There are 13 logical root server addresses globally. Using a routing technology called **Anycast**, those 13 IP addresses are shared across thousands of physical servers placed all over the globe.

## Top Level Domain Nameservers

Top Level Domain Nameservers servers manage domains based on their extensions (`.com`, `.org`, `.net`). They point the resolver to the specific authoritative server for that specific domain.

## Authoritative Nameservers

The final authority. This server holds the exact DNS zone records (like A or AAAA records). It returns the actual IP address of the destination server back to the resolver

## DNS Lookup

1. User types `example.com` into your browser.
2. Your browser and Operating System look inside their local cache. If missing, the OS passes a recursive query to your configured **DNS Resolver**.
3. The resolver sends an iterative query to a **Root nameserver**.
4. The root responds with the IP for the `.com` TLD server.
5. The resolver sends a query to the `.com` TLD server.
6. The TLD responds with the **Authoritative nameserver** for `example.com`.
7. The resolver reads the A record and returns the actual IP address (`192.0.2.1`) of `example.com`.
8. The browser then initializes a TCP handshake directly with that web server to load the site
