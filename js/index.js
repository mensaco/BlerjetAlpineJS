

window.App = () => {
    return {
        menuOpen: false,
        search:Alpine.$persist(''),
        articles: Alpine.$persist([]),
        categories: Alpine.$persist([]),
        shops: Alpine.$persist([]),
        onlyselected:Alpine.$persist(false),
        async getdefaults() {
            const rarticles = await fetch('/json/articles.json')
            this.articles = await rarticles.json()
            const rcategories = await fetch('/json/categories.json')
            this.categories = await rcategories.json()
            const rshops = await fetch('/json/shops.json')
            this.shops = await rshops.json()
        },
        get articlesSorted() {
            return this.articles.sort(function(a, b){
                return a.label > b.label
            });
        },
        get filteredArticles(){
            return this.articlesSorted
            .filter(a => a.label.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
        },
        get categoriesSorted() {
            var ctgs = this.categories.sort(function(a, b){
                return a.label > b.label
            });
            ctgs.forEach(c => {
                c.articles = this.filteredArticles.filter(a => a.categoryId == c.id).filter(a => !this.onlyselected || (this.onlyselected && (a.state == "buy" || a.state == "bought")))
            });
            return ctgs;
        },
        shortened(s, l){
            if(s.length <= l){
                return s
            }
            return s.substring(0,l)
        },
        changeState(article){
            const states = {
                "": "buy",
                "buy":"bought",
                "bought":""
            }
            article.state = states[article.state]??"buy"
            document.location = document.location.toString()

            
        },
        stateClass(article){
            const classes = {
                "": "bg-slate-300 text-slate-900",
                "buy":"bg-green-300 text-green-900",
                "bought":"bg-amber-300 text-amber-900"
            }
            return classes[article.state]??"bg-slate-300 text-slate-900"
        },
        categoryHasSelectedArticles(category) {
            const hasSelectedArticles = category.articles.some((x) => x.state == "buy" || x.state == "bought")
            return hasSelectedArticles
        }

    }
}