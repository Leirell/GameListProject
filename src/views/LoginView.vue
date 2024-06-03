<template>
    <div>
        <h1 class="flex flex-row justify-center flex-wrap w-2/3 m-auto text-white">Login Page</h1>

        <div class="login flex-row justify-center flex-wrap w-1/3 m-auto">
            <form @submit.prevent="submitLogin">
                <p v-if="errorMessage" class="text-red-500 flex m-auto justify-center">{{ errorMessage }}</p>
                <br>
                <input class="flex m-auto" type="text" v-model="userData.username" placeholder="Enter Username" />
                <br>
                <input class="flex m-auto" type="password" v-model="userData.password" placeholder="Enter Password" />
                <br>
                <button
                    class="flex m-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    type="submit">Login</button>
            </form>
            <br>

            <p>
                <router-link
                    class="m-auto justify-center bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    to="/sign-up">Sign up</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
    data() {
        return {
            userData: {
                username: '',
                password: ''
            },
            errorMessage: ''
        };
    },
    methods: {
        async submitLogin() {
            try {
                const loginRequest = await fetch(`/v1/api/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Establece el tipo de contenido del cuerpo como JSON
                    },
                    body: JSON.stringify(this.userData) // Pasamos los valores de userData al cuerpo de la solicitud
                });

                if (loginRequest.ok) {
                    const response = await loginRequest.json();
                    const token = response.response.token;

                    
                    // Usar el store para manejar el estado de autenticación
                    const { login } = useAuthStore()
                    // Almacenar el token y el username en el session storage
                    login(token, this.userData.username)

                    // Redirigir a otra ruta
                    this.$router.push('/');
                } else {
                    // Si la solicitud falla, mostrar un mensaje de error
                    this.errorMessage = 'Username/Password failed';
                }
            } catch (error) {
                // Si hay un error en la solicitud, mostrar un mensaje de error
                console.error('Error during login:', error);
                this.errorMessage = 'Error during login';
            }
        }
    }
}
</script>
