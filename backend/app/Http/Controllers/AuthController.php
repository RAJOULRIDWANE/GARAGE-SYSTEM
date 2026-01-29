<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;


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
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role' => $request->role ?? 'client',
        ]);

        // Create a token for this user
        $token = $user->createToken('myapptoken')->plainTextToken;

        // Return the user and token as JSON
        return response()->json([
            'user' => $user,
            'token' => $token
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

        // Create token
        $token = $user->createToken('myapptoken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }


    public function changePassword(Request $request)
    {
        // 1. Validate the input
        // 'confirmed' checks if 'newPassword' matches 'newPassword_confirmation'
        $request->validate([
            'currentPassword' => 'required',
            'newPassword'     => ['required', 'confirmed', 'min:6'],
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