<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyOtpMail;
use Carbon\Carbon;


class AuthController extends Controller
{


    // 1. REGISTER USER
    public function register(Request $request)
    {
        // Validate the incoming data
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|confirmed',
            'role' => 'sometimes|string|in:client,mechanic,supervisor,receptionist,parts_manager'

        ]);

        // Create the user in the database
        $otp = rand(100000, 999999);
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role' => $request->role ?? 'client',
            'otp' => $otp,
            'otp_expires_at' => Carbon::now()->addMinutes(5),
        ]);

        // Send OTP via Email
        Mail::to($user->email)->send(new VerifyOtpMail($otp));

        // Return the user as JSON (No token yet, must verify first)
        return response()->json([
            'user' => $user,
            'message' => 'Registration successful. Please verify your email with the OTP sent.'
        ], 201);
    }

    // 2. LOGIN USER
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        // Check email
        $user = User::where('email', $fields['email'])->first();

        // Check password
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Bad credentials'
            ], 401);
        }

        // Check if email is verified
        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Your email is not verified. Please verify your email first.',
                'email_not_verified' => true,
                'user' => $user
            ], 403);
        }

        // Create token
        $token = $user->createToken('myapptoken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    // 2.5. VERIFY OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        if (Carbon::now()->isAfter($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP has expired'], 400);
        }

        // Activate user
        $user->email_verified_at = Carbon::now();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Email verified successfully. You can now login.'
        ], 200);
    }

    // 2.6. RESEND OTP
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(5);
        $user->save();

        Mail::to($user->email)->send(new VerifyOtpMail($otp));

        return response()->json([
            'message' => 'OTP resent to your email.'
        ], 200);
    }


    public function changePassword(Request $request)
    {
        // 1. Validate the input
        // 'confirmed' checks if 'newPassword' matches 'newPassword_confirmation'
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => ['required', 'confirmed', 'min:6'],
        ]);

        // 2. Get the currently authenticated user
        $user = $request->user();

        // 3. Check if the Current Password matches the database
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json([
                'message' => 'The provided current password is incorrect.'
            ], 400); // Bad Request
        }

        // 4. Update the password
        $user->update([
            'password' => Hash::make($request->newPassword)
        ]);

        // 5. Return success
        return response()->json([
            'message' => 'Password updated successfully!'
        ], 200);
    }

    // 3. LOGOUT USER
    public function logout(Request $request)
    {
        // Delete the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}