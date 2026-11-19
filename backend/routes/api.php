<?php

use App\Http\Controllers\RsvpController;
use Illuminate\Support\Facades\Route;

Route::post('/rsvps', [RsvpController::class, 'store'])->middleware('throttle:10,1');
