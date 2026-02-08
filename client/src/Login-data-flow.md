# Login.jsx – Request/Response Data Flow

## 1. State (data held in the component)

| State       | Purpose                          |
|------------|-----------------------------------|
| `username` | Current value of the username input |
| `password` | Current value of the password input |
| `message`  | Text shown after submit (success or error) |
| `loading`  | `true` while the request is in flight     |

---

## 2. Data flow diagram (Mermaid)

```mermaid
flowchart TB
  subgraph UI["UI (user actions)"]
    A[User types in inputs] --> B[onChange handlers]
    B --> C[setUsername / setPassword]
    C --> D[State updates → re-render]
    D --> E[Inputs show new value]

    F[User clicks Submit] --> G[form onSubmit]
    G --> H[handleSubmit runs]
  end

  subgraph handleSubmit["handleSubmit"]
    H --> I[e.preventDefault]
    I --> J[setMessage '', setLoading true]
    J --> K[Build URL: DEV ? /api/login : /login]
    K --> L["fetch(POST, body: JSON.stringify({ username, password }))"]
    L --> M{Network}
  end

  subgraph Network["Request → Server"]
    M --> N[Browser sends HTTP POST]
    N --> O[Dev: Vite proxy /api → Express :3000]
    N --> P[Prod: Same origin /login]
    O --> Q[Express: POST /login]
    P --> Q
    Q --> R[Express reads req.body, sends text response]
    R --> S[Response back to browser]
  end

  subgraph Response["Handle response"]
    S --> T[res = fetch result]
    T --> U[text = await res.text()]
    U --> V[setMessage(text)]
    V --> W[finally: setLoading false]
    W --> X[UI shows message, button enabled]
  end

  M --> S
```

---

## 3. Step-by-step flow

### A. Input flow (controlled components)

1. User types in **User name** or **Password**.
2. `onChange` runs → `setUsername(e.target.value)` or `setPassword(e.target.value)`.
3. React updates state and re-renders.
4. Inputs use `value={username}` and `value={password}`, so they always show the current state.

### B. Submit flow (request)

1. User clicks **Submit** → form’s `onSubmit` runs.
2. `handleSubmit(e)` runs; `e.preventDefault()` stops the default form POST.
3. `setMessage('')` and `setLoading(true)` → message cleared, button shows “Submitting…”.
4. **URL**: `import.meta.env.DEV ? '/api' : ''`  
   - Dev: `base = '/api'` → request to `/api/login` (Vite proxies to Express).  
   - Prod: `base = ''` → request to `/login` (same origin).
5. **Request**:  
   `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })`  
   So the body is JSON: `{ "username": "...", "password": "..." }`.

### C. Server (Express)

1. Express receives `POST /login` (in dev after Vite proxy).
2. `express.json()` parses the body into `req.body`.
3. Handler does: `const { username, password } = req.body` and sends back a string, e.g.  
   `Received: user name = x, password = y`.

### D. Response flow (back in Login.jsx)

1. `await fetch(...)` resolves with the **Response** object `res`.
2. `await res.text()` reads the response body as a string.
3. `setMessage(text)` puts that string in state.
4. `finally` runs: `setLoading(false)`.
5. React re-renders: the paragraph shows `message`, and the button goes back to “Submit”.

### E. Error flow

1. If `fetch` throws (network error, etc.), the `catch` runs.
2. `setMessage('Error: ' + err.message)`.
3. `finally` still runs → `setLoading(false)`.

---

## 4. One-line summary

**User input → state → Submit → fetch POST with JSON body → Express → response text → setMessage / setLoading(false) → UI update.**
