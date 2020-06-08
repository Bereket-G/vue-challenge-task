Vue.component('x-table', {
    template: `<div class="table" :class="{ available : available }">
        <div v-if="available">
            <span class="mainLabel" >  Table Available  <p> ( Capacity = {capacity} ) </p> </span>
        </div>
        <div v-if="!available">
            <span class="mainLabel" >  Occupied by {occupants} <p> ( free in  {seconds | secondsToHumanReadable } ) </p>  </span>
            <p>
                <button @click="evictTimer" class="button evict-btn" v-if="!available"> Evict</button>
            </p>
        </div>

    </div>`,
    props: {
        id: Number,
        available: Boolean,
        capacity: Number,
        occupants: Number
    },
    data() {
        return {
            count_down_left_time: "",
            timerId: '',
            waitToAvailable: null,
            evicted: false,
            seconds: 0
        }
    },
    methods: {
        async startTimer(seconds) {
            this.seconds = seconds;
            this.waitToAvailable = new Promise(resolve => {
                this.timerId = setInterval(() => {
                    if (this.seconds && !this.evicted) {
                        this.seconds--;
                    } else {
                        resolve(this.getTableDetail());
                        // emit an event
                        this.$emit('makeTableAvaliable', {id: this.id, evicted: this.evicted});
                        clearInterval(this.timerId);
                        this.evicted = false;
                    }
                }, 1000);
            });
        },
        evictTimer() {
            this.evicted = true;
        },
        async untilAvailable() {
            return this.available ? this.getTableDetail() : await this.waitToAvailable;
        },
        getTableDetail() {
            // return object for promises after resolved
            return (({id, available, capacity, occupants}) => ({
                id, available, capacity, occupants
            }))(this.$props);
        },
        getCountdownLeftTime() {
            return this.seconds;
        }
    },
    computed: {
        mainLabel() {
            return this.available ? `Table Available  <p> ( Capacity = ${this.capacity}) </p> ` :
                `Occupied by ${this.occupants}
								<p> ( free in  ${this.count_down_left_time} ) </p> `;
        }
    },
    filters: {
        secondsToHumanReadable: (seconds) => {
            return new Date(seconds * 1000).toISOString().substr(14, 5);
        }
    },
    delimiters: ['{', '}'],
});
