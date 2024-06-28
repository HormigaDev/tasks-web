<template>
  <div>
    <div
      v-html="compiledMarkDown"
      :class="{
        'markdown-dark': _dark,
        'markdown-light': !_dark,
        't-markdown': true,
      }"
    ></div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import MarkdownIt from "markdown-it";

export default {
  name: "MarkDown",
  props: {
    markdown: {
      type: String,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const _markdown = ref(props.markdown);
    const _dark = ref(props.dark);
    const md = new MarkdownIt();
    const compiledMarkDown = ref(md.render(_markdown.value));
    watch(_markdown, () => {
      compiledMarkDown.value = md.render(_markdown.value);
    });
    watch(_dark, () => {
      _dark.value = props.dark;
    });

    return {
      compiledMarkDown,
      _dark,
    };
  },
};
</script>
<style lang="scss">
.markdown-dark {
  color: #fafafa;
}
.markdown-light {
  color: #333;
}
.t-markdown {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  p {
    margin-bottom: 6px;
  }
  ul,
  ol {
    margin-top: 2px;
    padding-top: 4px;
    margin-bottom: 2px;
    padding-bottom: 4px;
  }
}
</style>
