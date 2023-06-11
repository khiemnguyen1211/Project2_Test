import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'LARAVELCHAT123',
    cluster: 'mt1',
    encrypted: false,
});

export default echo;
