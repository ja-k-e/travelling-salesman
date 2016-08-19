# Travelling Salesman
## Attempting TS optimizations

### Theories
- optimal path revolves around a center `0,0` (origin).
- node distance from origin increases liklihood that it is connected to its closest nodes
- nodes are relatively clustered
- once clustered nodes' paths are optimized, they become a single node in a new generation
- clustered nodes go through process of being clustered until there is one cluster
