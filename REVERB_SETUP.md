# Laravel Reverb Real-Time Notifications Setup Guide

## Overview

This guide explains how to set up Laravel Reverb for real-time notifications in the Contact Us page. Reverb provides WebSocket support for Laravel applications, enabling real-time communication between the backend and frontend.

## Backend Setup (Laravel)

### 1. Install Reverb Package

```bash
composer require laravel/reverb
```

### 2. Publish Configuration

```bash
php artisan reverb:install
```

This command will:
- Create the `config/reverb.php` configuration file
- Generate a `REVERB_APP_KEY` in your `.env` file
- Set up necessary environment variables

### 3. Configure Environment Variables

Update your `.env` file:

```env
BROADCAST_DRIVER=reverb

REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=ws
```

For production:
```env
REVERB_SCHEME=wss
REVERB_HOST=your-domain.com
```

### 4. Create a Broadcasting Event

Create a new event for contact notifications:

```bash
php artisan make:event ContactNotificationEvent
```

Update `app/Events/ContactNotificationEvent.php`:

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContactNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $data;

    public function __construct($message, $data = [])
    {
        $this->message = $message;
        $this->data = $data;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('contact-notifications'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'data' => $this->data,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
```

### 5. Update Contact Controller

In your `ContactUsController`:

```php
<?php

namespace App\Http\Controllers;

use App\Events\ContactNotificationEvent;
use App\Models\ContactUs;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        // Save to database
        $contact = ContactUs::create($validated);

        // Broadcast real-time notification
        broadcast(new ContactNotificationEvent(
            'New contact message received!',
            [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'subject' => $contact->subject,
            ]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $contact,
        ]);
    }
}
```

### 6. Start Reverb Server

```bash
php artisan reverb:start
```

For production, use a process manager like Supervisor or PM2:

```bash
pm2 start "php artisan reverb:start" --name reverb
```

## Frontend Setup (React)

### 1. Environment Variables

Create or update your `.env` file:

```env
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=ws
VITE_REVERB_APP_KEY=your-app-key
```

For production:
```env
VITE_REVERB_HOST=your-domain.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=wss
VITE_REVERB_APP_KEY=your-app-key
```

### 2. Using the useReverb Hook

The `useReverb` hook is already integrated in the Contact page. Here's how to use it:

```jsx
import { useReverb } from "@/hooks/useReverb";

function MyComponent() {
  const { connected, subscribe, unsubscribe, send } = useReverb();

  // Subscribe to a channel
  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe("contact-notifications", (data) => {
        console.log("Received:", data);
      });

      return () => unsubscribe();
    }
  }, [connected, subscribe]);

  return (
    <div>
      Status: {connected ? "Connected" : "Connecting..."}
    </div>
  );
}
```

### 3. Hook API

#### `useReverb()`

Returns an object with:

- **`connected`** (boolean): Whether the WebSocket is connected
- **`subscribe(channel, callback, event?)`**: Subscribe to a channel
  - Returns an unsubscribe function
- **`unsubscribe(channel)`**: Unsubscribe from a channel
- **`send(channel, event, data)`**: Send a message to a channel
- **`disconnect()`**: Disconnect from Reverb

## Testing

### 1. Local Testing

1. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

2. Start Reverb:
   ```bash
   php artisan reverb:start
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

4. Navigate to the Contact page and submit a message

### 2. Browser Console

Open the browser console (F12) to see:
- `[Reverb] Connected to WebSocket`
- `[Contact] Received notification: {...}`

## Troubleshooting

### Connection Issues

1. **Port already in use**: Change `REVERB_PORT` to an available port
2. **CORS errors**: Ensure Reverb is configured to accept connections from your frontend domain
3. **WebSocket blocked**: Some firewalls block WebSocket connections; use WSS (secure WebSocket) in production

### Message Not Received

1. Check that the event is being broadcast:
   ```bash
   php artisan tinker
   > broadcast(new \App\Events\ContactNotificationEvent('Test'));
   ```

2. Verify the channel name matches on both backend and frontend

3. Check browser console for errors

### Production Deployment

1. Use WSS (secure WebSocket) with SSL certificates
2. Configure a reverse proxy (Nginx/Apache) to forward WebSocket connections
3. Use a process manager to keep Reverb running
4. Monitor logs for connection issues

## Security Considerations

1. **Validate Channel Access**: Implement authorization checks in your events
2. **Rate Limiting**: Add rate limiting to prevent spam
3. **CSRF Protection**: Ensure CSRF tokens are included in requests
4. **SSL/TLS**: Always use WSS in production
5. **Firewall Rules**: Configure firewall to allow WebSocket traffic

## Example Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /app {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## References

- [Laravel Reverb Documentation](https://laravel.com/docs/reverb)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Broadcasting in Laravel](https://laravel.com/docs/broadcasting)
