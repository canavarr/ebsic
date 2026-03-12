# Navigation Test Report - Empty Portfolio Name

## Test Scenario
- Navigate to http://localhost:5176/
- Leave portfolio name field empty
- Attempt to start Classic mode
- Attempt to start Advanced mode

## Code Analysis Results

### Multiple Validation Layers

#### Layer 1: Button State (Landing.jsx:116)
```javascript
disabled={checking || !n.trim()}
```
**Result**: Button is DISABLED when portfolio name is empty

#### Layer 2: onClick Guard (Landing.jsx:121)
```javascript
if (checking || !n.trim()) return
```
**Result**: Even if clicked, function returns immediately if name is empty

#### Layer 3: handleStart Validation (Landing.jsx:27-32)
```javascript
if (!name) {
  setNameError(t.formNameRequired)
  return
}
```
**Result**: Sets error message and returns before any navigation logic

#### Layer 4: Classic Mode Callback Validation (index.jsx:21-25)
```javascript
const valid = hasValidName(d)
if (!valid) return
navigate('/classic', { state: d })
```
**Result**: Double-checks name validity before navigation

#### Layer 5: Advanced Mode Callback Validation (index.jsx:29-34)
```javascript
const valid = hasValidName(d)
if (!valid) return
navigate('/advanced', { state: { ...d, teamName: trimmed } })
```
**Result**: Double-checks name validity before navigation

## Expected Behavior

### With Empty Portfolio Name:

**Classic Mode ("Algajale" button):**
1. ❌ Button appears DISABLED (grayed out)
2. ❌ Cursor shows "not-allowed" when hovering
3. ❌ Clicking has NO effect (onClick guard)
4. ❌ NO navigation occurs
5. ✅ User stays on landing page (/)
6. ⚠️  Error message MAY appear if user tries to submit

**Advanced Mode ("Edasijõudnule" button):**
1. ❌ Button appears DISABLED (grayed out)
2. ❌ Cursor shows "not-allowed" when hovering
3. ❌ Clicking has NO effect (onClick guard)
4. ❌ NO navigation occurs
5. ✅ User stays on landing page (/)
6. ⚠️  Error message MAY appear if user tries to submit

## Debug Instrumentation

The code includes debug logging to http://127.0.0.1:7441/ingest/ with session ID '08cc62'.

### Expected Debug Logs (if button somehow gets clicked):
- Location: `src/pages/classic/Landing.jsx:startButton`
- Message: `start button onClick fired`
- Data: `{checking: false, rawNameLength: 0, trimmedNameLength: 0, isBlocked: true}`

### Expected Debug Logs (if handleStart is called):
- Location: `src/pages/classic/Landing.jsx:handleStart`
- Message: `handleStart invoked`
- Followed by: `empty-name branch hit`
- Data: `{mode: "algajale" or "edasijoudnule", rawNameLength: 0, trimmedNameLength: 0}`

### NOT Expected (empty name should block these):
- ❌ "calling onStart"
- ❌ "calling onStartAdvanced"
- ❌ "onStart callback invoked"
- ❌ "onStartAdvanced callback invoked"

## Conclusion

Based on code analysis, with an empty portfolio name:
- **Navigation SHOULD NOT occur** for either mode
- **Multiple validation layers** prevent navigation
- **Button is visually disabled**
- **User remains on landing page**

If navigation DOES occur with empty name, it indicates a bug in the validation logic or a race condition.
