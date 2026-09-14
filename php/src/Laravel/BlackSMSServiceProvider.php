<?php

namespace BlackSMS\Laravel;

use BlackSMS\BlackSMS;
use Illuminate\Support\ServiceProvider;

class BlackSMSServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../../config/blacksms.php' => config_path('blacksms.php'),
            ], 'blacksms-config');
        }
    }

    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../../config/blacksms.php', 'blacksms');

        $this->app->singleton('blacksms', function ($app) {
            $config = $app['config']->get('blacksms');
            return new BlackSMS(
                $config['api_key'] ?? '',
                $config['base_url'] ?? 'https://blacksms.in',
                $config['default_sender_id'] ?? null
            );
        });

        $this->app->alias('blacksms', BlackSMS::class);
    }
}
