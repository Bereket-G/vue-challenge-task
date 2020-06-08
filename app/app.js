const app = new Vue({
    el: '#app',
    data: {
        new_party_form: {
            occupants: null,
            occupied_duration: null,
            fuss_message: ''
        }
    },
    methods: {
        submitNewPartyForm() {
            if (!this.new_party_form.occupants || !this.new_party_form.occupied_duration) return;
            this.$refs.restaurantComponent.occupyTable(this.new_party_form);
            this.resetForm();
        },
        resetForm() {
            this.new_party_form = {
                occupants: null,
                occupied_duration: null,
                fuss_message: ''
            }
        }
    },
    delimiters: ['{', '}'],
});
