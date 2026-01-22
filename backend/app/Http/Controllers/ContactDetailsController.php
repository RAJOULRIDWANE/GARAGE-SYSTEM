<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactDetails; // <--- Import your new model
use Illuminate\Support\Facades\Validator;

class ContactDetailsController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate the input
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:191',
            'email'   => 'required|email|max:191',
            'phone'   => 'required|string|max:20',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        // 2. Save to Database
        $contact = ContactDetails::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'phone'   => $request->phone,
            'message' => $request->message,
        ]);

        if($contact) {
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