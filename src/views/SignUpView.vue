<template>
    <div>
        <h1 class="flex flex-row justify-center flex-wrap w-2/3 m-auto text-white">Sign Up Page</h1>

        <div class="signup flex-row justify-center flex-wrap w-1/3 m-auto">
            <form @submit.prevent="submitSignUp">
                <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
                <br>
                <input class="flex m-auto" type="text" v-model="userData.username" placeholder="Enter Username" />
                <br>
                <input class="flex m-auto" type="email" v-model="userData.email" placeholder="Enter Email" />
                <br>
                <input class="flex m-auto" type="password" v-model="userData.password" placeholder="Enter Password" />
                <br>
                <button
                    class="flex m-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    type="submit">Sign Up</button>
            </form>
            <br>

            <p>
                <router-link
                    class="m-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    to="/login">Login</router-link>
            </p>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            userData: {
                username: '',
                email: '',
                password: ''
            },
            errorMessage: ''
        };
    },
    methods: {
        async submitSignUp() {
            try {
                const signUpRequest = await fetch(`/v1/api/user/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Establece el tipo de contenido del cuerpo como JSON
                    },
                    body: JSON.stringify(this.userData) // Pasamos los valores de userData al cuerpo de la solicitud
                });

                if (signUpRequest.ok) {
                    // Si la solicitud es exitosa, redirigir a otra ruta
                    this.$router.push('/');
                } else {
                    // Si la solicitud falla, mostrar un mensaje de error adecuado
                    const errorData = await signUpRequest.json();
                    if (errorData.error) {
                        this.errorMessage = errorData.error;
                    } else {
                        this.errorMessage = 'There is already an account with that Username/Email';
                    }
                }
            } catch (error) {
                // Si hay un error en la solicitud, mostrar un mensaje de error
                console.error('Error during sign up:', error);
                this.errorMessage = 'There is already an account with that Username/Email';
            }
        }
    }
}
</script>