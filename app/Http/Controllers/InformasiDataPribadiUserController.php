<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InformasiDataPribadiUserController extends Controller
{
    /**
     * Display the personal data information form.
     */
    public function index()
    {
        if (! Auth::check()) {
            return redirect()->route('auth.login.form');
        }

        return redirect()->route('account.password.edit');
    }

    /**
     * Keep the legacy profile update URL compatible with the settings form.
     */
    public function update(Request $request)
    {
        if (! Auth::check()) {
            return redirect()->route('auth.login.form');
        }

        return app(AccountController::class)->update($request);
    }
}
