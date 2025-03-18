const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Get Queue
app.get('/queue', async (req, res) => {
    const { data, error } = await supabase
        .from('queue')
        .select('id, position, players(name, joined_at)')
        .order('position', { ascending: true });

    if (error) return res.status(500).json(error);
    res.json(data);
});

// Add Player to Queue
app.post('/queue', async (req, res) => {
    const { name } = req.body;

    // Insert player
    let { data: player, error: playerError } = await supabase
        .from('players')
        .insert([{ name }])
        .select();

    if (playerError) return res.status(500).json(playerError);

    // Add to queue
    let { data: queue, error: queueError } = await supabase
        .from('queue')
        .insert([{ player_id: player[0].id, position: player[0].id }]);

    if (queueError) return res.status(500).json(queueError);
    res.json(queue);
});

// Switch Player Positions
app.post('/queue/switch', async (req, res) => {
    const { pos1, pos2 } = req.body;

    let { data: queue1 } = await supabase
        .from('queue')
        .select('*')
        .eq('position', pos1)
        .single();

    let { data: queue2 } = await supabase
        .from('queue')
        .select('*')
        .eq('position', pos2)
        .single();

    await supabase.from('queue').update({ position: pos2 }).eq('id', queue1.id);
    await supabase.from('queue').update({ position: pos1 }).eq('id', queue2.id);

    res.json({ success: true });
});

// Delete Top Pair
app.delete('/queue', async (req, res) => {
    let { data, error } = await supabase
        .from('queue')
        .select('*')
        .order('position', { ascending: true })
        .limit(2);

    if (data.length === 2) {
        await supabase.from('queue').delete().eq('id', data[0].id);
        await supabase.from('queue').delete().eq('id', data[1].id);
    }

    res.json({ success: true });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
