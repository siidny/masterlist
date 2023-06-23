      const gsheetURL = "https://sheets.googleapis.com/v4/spreadsheets/1pdDoQnCOoMnjtEnSzRDzlzmz9gtBwdRY2Wh7GwcE7NA/values/Sheet1?key=AIzaSyAWleGQ7SUwXyt4DwnWlu1H8J1W8VI5pSA";

        new Vue({
            el: '#app',
            data() {
                return {
                    searchInput: '',
                    noResults: false,
                    titles: [],
                    filteredTitles: [],
                    currentPage: 1,
                    itemsPerPage: 10,
                    initialLoad: true,
                    titleProperties: [
                        { key: 'classes', label: 'classes' },
                        { key: 'schoolname', label: 'Language school name' },
                        { key: 'location', label: 'Location' },
                        { key: 'address', label: 'Address' },
                        { key: 'suburb', label: 'Suburb' },
                        { key: 'postcode', label: 'Postcode' },
                    ]
                };
            },
            async mounted() {
                try {
                    const response = await axios.get(gsheetURL);
                    this.parseData(response);
                    this.initialLoad = false;
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            },
            methods: {
                filterTitles(event) {
                    this.searchInput = event.target.value;
                    this.currentPage = 1;
                    const query = this.searchInput.toLowerCase();
                    if (query.length < 1) {
                        this.filteredTitles = [];
                        this.initialLoad = true;
                        return;
                    }
                   this.filteredTitles = this.titles.filter(title => {
        const postcode = title.postcode ? title.postcode.trim().toLowerCase() : '';
        const language = title.language ? title.language.trim().toLowerCase() : '';
        const classes = title.classes ? title.classes.trim().toLowerCase() : '';
        const suburb = title.suburb ? title.suburb.trim().toLowerCase() : '';

        return postcode.includes(query) ||
               language.includes(query) ||
               classes.includes(query) ||
               suburb.includes(query);
                          
                    ));
                    this.noResults = this.filteredTitles.length === 0;

                    this.initialLoad = false;
                },
                parseData(entries) {
                    entries.data.values.slice(1).forEach(value => {
                        const entry = {
                            publicprivate: value[0],
                              language: value[1],
                            schoolname: value[2],
                            location: value[3],
                            address: value[4],
                            suburb: value[5],
                            state: value[6],
                            postcode: value[7],
                            classes: value[8],
                            unique: value[9]
                        };
                        this.titles.push(entry);
                    });

                    this.filteredTitles = this.titles;
                    console.log(this.titles);
                }
            },
            computed: {
                paginatedTitles() {
                    return this.titlesToDisplay.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
                },
                totalPages() {
                    return Math.ceil(this.titlesToDisplay.length / this.itemsPerPage);
                },
                titlesToDisplay() {
                    if (this.initialLoad) {
                        return [];
                    }
                    return this.filteredTitles.length > 0 ? this.filteredTitles : this.titles;
                }
            }
        })
  
