<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Customer;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);
        $search = $request->query('search', '');

        $query = Appointment::query();
        $type = $request->query('type', ''); // Get the status filter from query params


        if ($type) {
            $query->where('type', $type);
        }

        if ($search) {
            $query->join('customers_appointments', 'appointments.id', '=', 'customers_appointments.appointment_id')
                ->join('customers', 'customers.id', '=', 'customers_appointments.customer_id')
                ->where('customers.name', 'LIKE', "%{$search}%")
                ->orWhere('customers.phone', 'LIKE', "%{$search}%")
                ->select('appointments.*');
        }

        $appointments = $query->with('customers')->paginate($perPage, ['*'], 'page', $page);

        return AppointmentResource::collection($appointments);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreAppointmentRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAppointmentRequest $request)
    {
        $validated = $request->validate([
            'information' => 'required|string|max:255',
            'time' => 'required|date_format:d-m-Y H:i',
            'type' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
        ]);

        // Create or find the customer
        $customer = Customer::firstOrCreate(
            ['phone' => $validated['customer_phone']],
            ['name' => $validated['customer_name']]
        );

        // Create the appointment
        $appointment = Appointment::create($validated);

        // Attach the customer to the appointment
        $appointment->customers()->attach($customer->id);

        return new AppointmentResource($appointment);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function show(Appointment $appointment)
    {
        return new AppointmentResource($appointment->load('customers'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateAppointmentRequest  $request
     * @param  \App\Models\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $data = $request->validated();
        $appointment->load('customers')->update($data);

        return new AppointmentResource($appointment);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Appointment  $appointment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response("", 204);
    }
}
