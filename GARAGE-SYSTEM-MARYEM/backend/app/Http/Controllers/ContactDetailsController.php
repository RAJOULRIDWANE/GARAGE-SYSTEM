<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactDetails; // <--- Import your new model
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessageMail;

class ContactDetailsController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:191',
            'email' => 'required|email|max:191',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
        ];

        // 2. Save to Database
        $contact = ContactDetails::create($data);

        // 3. Send Email (to address in .env MAIL_FROM_ADDRESS)
        try {
            $adminEmail = config('mail.from.address');
            Mail::to($adminEmail)->send(new ContactMessageMail($data));
        } catch (\Exception $e) {
            // We still return 200 because it's saved in DB, but log error or add to response if needed
            // For now, let's just log it quietly or ignore to not break frontend
            \Log::error("Failed to send contact email: " . $e->getMessage());
        }

        if ($contact) {
            return response()->json([
                'status' => 200,
                'message' => 'Message Sent Successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong'
            ], 500);
        }
    }
}