<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Illuminate\Support\Facades\Hash;  //importamos la funcion HASH para proteger la contraseña

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            //Generamos un registro automomatico
            'registro'=>$this->generarRegistro(),
            'name' => $input['name'],
            'email' => $input['email'],
            'password' =>Hash::make( $input['password']), //protegemos la funcion la contraseña con hash 
            'role_id' => 6,
        ]);
        
    }
     /**
     * Genera un número de registro único automáticamente.
     */
    public function generarRegistro() : int 
    {
        $ultimo=User::max('registro')??1000;
        return $ultimo+1;
    }
}
