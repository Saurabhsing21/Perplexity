import React from 'react'
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
)

const authpage = () => {
    return (<>
        <button>Login with gmail </button>
        <button>Login with Github</button>
    </>
    )
}

export default authpage