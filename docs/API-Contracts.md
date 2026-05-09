# API Contracts

## REST API (Express / Next.js API Routes)

### 1. Products API
**GET `/api/products`**
- Query params: `category`, `search`, `limit`, `offset`
- Response: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Arduino Uno R3",
      "price": 25.00,
      "simulationId": "arduino_uno_r3"
    }
  ],
  "pagination": { "total": 150 }
}
```

### 2. Projects API
**POST `/api/projects`**
- Body: `{ "name": "My LED Blinker", "type": "BREADBOARD", "data": {...} }`
- Response: `201 Created`
```json
{ "id": "uuid", "message": "Project saved successfully." }
```

**GET `/api/projects/:id`**
- Response: `200 OK`
```json
{
  "id": "uuid",
  "name": "My LED Blinker",
  "data": { "nodes": [], "edges": [] },
  "code": "void setup() { ... }"
}
```

### 3. AI Assistant API (Electron)
**POST `/api/ai/chat`**
- Body: 
```json
{
  "prompt": "Why is my LED burning out?",
  "context": {
    "circuit_data": { "nodes": [{"type": "LED", "current": 50}], "edges": [] },
    "code": "..."
  }
}
```
- Response: `200 OK` (Server-Sent Events for streaming)
```text
data: {"chunk": "Based on your circuit data, the current through the LED is 50mA..."}
```

### 4. Hardware Compilation API
**POST `/api/compile`**
- Body: `{ "code": "void setup() {...}", "board": "uno" }`
- Response: `200 OK`
```json
{
  "success": true,
  "hexData": "...",
  "logs": "Compiled successfully. Memory usage: 12%."
}
```
