<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use LdapRecord\Laravel\Auth\HasLdapUser;
use LdapRecord\Laravel\Auth\LdapAuthenticatable;
use LdapRecord\Laravel\Auth\AuthenticatesWithLdap;

class User extends Authenticatable implements LdapAuthenticatable
{
    use HasFactory, Notifiable, AuthenticatesWithLdap, HasLdapUser;

    protected $fillable = [
        'name',
        'email',
        'password',
        'guid',  // 🔥 Добавляем сюда!
    ];

    public function getLdapGuidColumn(): string
    {
        return 'guid';  // 🔥 Говорим Laravel, что `guid` - наш ключ
    }

    public function getLdapDomainColumn(): string
    {
        return 'email'; // 🔥 Или другой столбец, по которому сопоставлять LDAP
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }
    
    public function comments()
    {
        return $this->hasMany(ShiftComment::class);
    }
    

}
