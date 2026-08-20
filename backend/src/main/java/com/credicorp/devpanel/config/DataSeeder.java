package com.credicorp.devpanel.config;

import com.credicorp.devpanel.entity.User;
import com.credicorp.devpanel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

/**
 * Seeds the database with a handful of demo users (including the login
 * credentials documented in the README) the first time the app starts
 * against an empty table. Never overwrites existing data, and never writes
 * plaintext passwords — they go through the same BCryptPasswordEncoder used
 * at login.
 *
 * This replaces "hardcoded users in a JSON file": everything lives in
 * Postgres, behind the same repository/service used by real requests.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean seedEnabled;

    private static final String[] FIRST_NAMES = {
            "Ana", "Luis", "Maria", "Carlos", "Sofia", "Diego", "Valeria", "Jorge",
            "Camila", "Andres", "Paula", "Ricardo", "Gabriela", "Fernando", "Lucia",
            "Miguel", "Daniela", "Roberto", "Isabel", "Sergio", "Elena", "Pablo",
            "Natalia", "Oscar"
    };
    private static final String[] LAST_NAMES = {
            "Gonzalez", "Rodriguez", "Perez", "Martinez", "Sanchez", "Ramirez",
            "Torres", "Flores", "Rivera", "Diaz", "Castillo", "Vargas"
    };

    public DataSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${devpanel.seed.enabled:true}") boolean seedEnabled) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedEnabled = seedEnabled;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        // Login credentials used in the README / demo.
        userRepository.save(User.builder()
                .fullName("Jason Admin")
                .email("admin@devpanel.local")
                .passwordHash(passwordEncoder.encode("Admin123!"))
                .role(User.Role.ADMIN)
                .status(User.Status.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .fullName("Demo User")
                .email("user@devpanel.local")
                .passwordHash(passwordEncoder.encode("User123!"))
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build());

        // Extra rows so the table + search + pagination have something to chew on.
        List<User> batch = new java.util.ArrayList<>();
        for (int i = 1; i <= 40; i++) {
            String first = FIRST_NAMES[i % FIRST_NAMES.length];
            String last = LAST_NAMES[i % LAST_NAMES.length];
            String fullName = first + " " + last;
            String email = (first + "." + last + i).toLowerCase(Locale.ROOT) + "@devpanel.local";

            batch.add(User.builder()
                    .fullName(fullName)
                    .email(email)
                    .passwordHash(passwordEncoder.encode("Changeme123!"))
                    .role(i % 11 == 0 ? User.Role.ADMIN : User.Role.USER)
                    .status(i % 7 == 0 ? User.Status.INACTIVE : User.Status.ACTIVE)
                    .build());
        }
        userRepository.saveAll(batch);
    }
}
