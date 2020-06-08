Vue.component('x-restaurant', {
    template: `<div class="restaurant">
        <x-table v-for="table in tables" v-bind="table" :ref="'table_'+ table.id"
                 @makeTableAvaliable="makeTableAvaliable" v-bind:key="table.id"></x-table>
    </div>`,
    data() {
        return {
            default_table_capacities: [10, 8, 10, 6, 2, 6, 4, 12],
            tables: [],
        }
    },
    methods: {
        occupyTable(new_party_form) {

            // sort with capacity
            let sorted_tables = [...this.tables].sort((a, b) => a.capacity - b.capacity);

            for (let table of sorted_tables) {
                if (table.capacity >= new_party_form.occupants && table.available) {
                    this.tables[table.id].available = false;
                    this.tables[table.id].occupants = parseInt(new_party_form.occupants);
                    this.tables[table.id].fuss_message = new_party_form.fuss_message;
                    this.$refs[`table_${table.id}`][0].startTimer(parseInt(new_party_form.occupied_duration));
                    this.$forceUpdate(); // trigger vue to detect deep changes
                    return;
                }
            }
            alert('Table Not available');
        },
        makeTableAvaliable(table_status) {
            this.tables[table_status.id].available = true;
            if (table_status.evicted) alert(this.tables[table_status.id].fuss_message);
            this.$forceUpdate(); // trigger vue to detect deep changes
        },
        async awaitTable(table_size) {
            let promises = [];
            this.tables.forEach((table, indx) => {
                if (table.capacity >= table_size) {
                    promises.push(this.$refs[`table_${indx}`][0].untilAvailable());
                }
            });
            return await Promise.race(promises);
        },
        save(key) {
            const tables_state = this.tables.map((table) => {
                if (!table.available) {
                    // if the table is occupied save the countdown left time
                    table.count_down_left_time = this.$refs[`table_${table.id}`][0].getCountdownLeftTime();
                }
                return table;
            });
            localStorage.setItem(key, JSON.stringify(tables_state));

        },
        load(key) {
            let tables_state = localStorage.getItem(key);
            if (!tables_state) return;

            tables_state = JSON.parse(tables_state);

            this.tables = tables_state;

            tables_state.forEach((table) => {
                if (!table.available) {
                    // set the countdown left time
                    this.$refs[`table_${table.id}`][0].startTimer(parseInt(table.count_down_left_time));
                }
            });
        }

    },
    created() {
        this.default_table_capacities.forEach((x, indx) => {
            // i am using indexed array for efficient access later. But it entails to trigger forceUpdate on changes.
            this.tables[indx] = {
                id: indx,
                capacity: x,
                available: true
            };
        });
    },
    delimiters: ['{', '}'],
});
