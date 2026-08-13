<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmailCodeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Throwable;

class TestEmailController extends Controller
{
    public function show(): View
    {
        return view('test-email', [
            'mailer' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'scheme' => config('mail.mailers.smtp.scheme'),
            'fromAddress' => config('mail.from.address'),
            'fromName' => config('mail.from.name'),
            'result' => session('test_email_result'),
            'error' => session('test_email_error'),
            'sentTo' => session('test_email_to'),
            'sentCode' => session('test_email_code'),
        ]);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $code = (string) random_int(100000, 999999);
        $user = new User([
            'name' => strstr($data['email'], '@', true) ?: 'Test',
            'email' => $data['email'],
        ]);

        try {
            Mail::to($data['email'])->send(new VerifyEmailCodeMail($user, $code));
        } catch (Throwable $e) {
            report($e);

            return back()
                ->withInput()
                ->with('test_email_error', $e->getMessage());
        }

        return back()->with([
            'test_email_result' => 'Verification email sent. Check inbox and spam.',
            'test_email_to' => $data['email'],
            'test_email_code' => $code,
        ]);
    }
}
