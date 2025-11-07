<template>
  <v-container fluid class="py-12 px-4 px-md-12 bg-sextary">
    <div class="text-center mb-10">
      <p class="font-weight-medium text-secondary">Paradise Hotel</p>
      <h2 class="text-h4 font-weight-bold">Main Facilities</h2>
    </div>

    <v-row dense justify="center">
      <v-col
        v-for="(item, i) in facilities"
        :key="i"
        cols="12"
        sm="6"
        md="3"
        class="text-center mb-8"
      >
        <v-icon size="70" class="mb-4" color="secondary">{{ item.icon }}</v-icon>
        <div class="font-weight-bold mb-2" style="font-size: 1.5rem;">{{ item.title }}</div>
        <p class="">{{ item.description }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      facilities: [
        {
          title: "Private Parking",
          description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
          icon: "mdi-car"
        },
        {
          title: "High Speed Wifi",
          description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
          icon: "mdi-wifi"
        },
        {
          title: "Bar & Restaurant",
          description: "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
          icon: "mdi-glass-cocktail"
        },
        {
          title: "Swimming Pool",
          description: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.",
          icon: "mdi-pool"
        }
      ]
    };
  }
};
</script>
